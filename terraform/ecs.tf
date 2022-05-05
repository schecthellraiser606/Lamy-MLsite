#cluster
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project}-myapp-cluster"
}

#IAMrole
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.project}-myEcsTask-exe-Role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "ecs_task_role" {
  name               = "${var.project}-myEcsTask-Role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "amazon_ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ssm-read-policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

resource "aws_iam_role_policy_attachment" "task_s3" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

#Fargate-TASK
resource "aws_ecs_task_definition" "ecs_task_def" {
  family                   = "${var.project}-myapp-task-def"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 2048
  memory                   = 4096
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  depends_on = [
    aws_db_instance.mariadb_instance,
  ]

  container_definitions = jsonencode([
    {
      "name" : "webapp",
      "image" : "${aws_ecr_repository.ecr_backend_app.repository_url}:latest",
      "memory" : 2048,
      "essential" : true,
      "command" : ["./startup.sh"],
      "environment" : [
        { "name" : "DB_NAME", "value" : "${var.db_name}" },
        { "name" : "DB_HOST", "value" : "${aws_db_instance.mariadb_instance.address}" },
        { "name" : "DB_USER", "value" : "${var.db_username}" },
        { "name" : "DB_PASSWORD", "value" : "${random_string.db_password.result}" },
        { "name" : "DB_PORT", "value" : "3306" },
        { "name" : "AWS_ACCESS_KEY_ID", "value" : "${var.aws_access_key_id}" },
        { "name" : "AWS_SECRET_ACCESS_KEY", "value" : "${var.aws_secret_access_key}" },
        { "name" : "AWS_STORAGE_BUCKET_NAME", "value" : "${aws_s3_bucket.s3_image_learn_bucket.bucket}" },
        { "name" : "AWS_S3_REGION_NAME", "value" : "${aws_s3_bucket.s3_image_learn_bucket.region}" },
        { "name" : "MYAPP_DOMAIN", "value" : "${var.route53_domain}" },
      ],
      "portMappings" : [
        {
          "containerPort" : 8000
        }
      ],
      "healthCheck" : {
        "command" : [
          "CMD-SHELL",
          "curl -f http://localhost:8000/aiapps/ || exit 1"
        ],
      },
      "logConfiguration" : {
        "logDriver" : "awslogs",
        "options" : {
          "awslogs-region" : "ap-northeast-1",
          "awslogs-group" : "${aws_cloudwatch_log_group.fargate_cluster_log_group.name}",
          "awslogs-stream-prefix" : "webapp-container-log-stream"
        }
      }
    },
    {
      "name" : "frontend",
      "image" : "${aws_ecr_repository.ecr_front_app.repository_url}:latest",
      "memory" : 2048,
      "essential" : true,
      "command" : ["./startup.sh"],
      "environment" : [
        { "name" : "NEXT_PUBLIC_FIREBASE_API_KEY", "value" : "${var.firebase_api_key}" },
        { "name" : "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "value" : "${var.firebase_auth_domain}" },
        { "name" : "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "value" : "${var.firebase_project_id}" },
        { "name" : "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "value" : "${var.firebase_storage_bucket}" },
        { "name" : "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "value" : "${var.firebase_messaging_sender_id}" },
        { "name" : "NEXT_PUBLIC_FIREBASE_APP_ID", "value" : "${var.firebase_app_id}" },
        { "name" : "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", "value" : "${var.firebase_measurement_id}" },
        { "name" : "NEXT_PUBLIC_URL", "value" : "https://www.${var.route53_domain}" },
        { "name" : "INTERNAL_URL", "value" : "localhost" },
        { "name" : "NEXT_PUBLIC_S3_STATIC_URL", "value" : "${aws_s3_bucket.s3_image_static_bucket.bucket_regional_domain_name}" },
        { "name" : "NEXT_PUBLIC_S3_LEARN_URL", "value" : "${aws_s3_bucket.s3_image_learn_bucket.bucket_regional_domain_name}" },
      ],
      "portMappings" : [
        {
          "containerPort" : 3000
        }
      ],
      "dependsOn" : [
        {
          "containerName" : "webapp",
          "condition" : "HEALTHY"
        }
      ],
      "logConfiguration" : {
        "logDriver" : "awslogs",
        "options" : {
          "awslogs-region" : "ap-northeast-1",
          "awslogs-group" : "${aws_cloudwatch_log_group.fargate_cluster_log_group.name}",
          "awslogs-stream-prefix" : "frontend-container-log-stream"
        }
      }
    }
  ])
}

#ECS-Service
resource "aws_ecs_service" "ecs_fargate_service" {
  name                 = "${var.project}-myapp-ecs-serice"
  cluster              = aws_ecs_cluster.ecs_cluster.arn
  task_definition      = aws_ecs_task_definition.ecs_task_def.arn
  desired_count        = 1
  launch_type          = "FARGATE"
  force_new_deployment = true

  deployment_minimum_healthy_percent = 50
  health_check_grace_period_seconds  = 60

  network_configuration {
    security_groups = [aws_security_group.app_sg.id]
    subnets = [
      aws_subnet.public_subnet_1a_app.id,
      aws_subnet.public_subnet_1c_app.id,
    ]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.alb_target_group_front.arn
    container_name   = "frontend"
    container_port   = 3000
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.alb_target_group_backend.id
    container_name   = "webapp"
    container_port   = 8000
  }

  lifecycle {
    ignore_changes = [
      desired_count,
      load_balancer,
    ]
  }
}