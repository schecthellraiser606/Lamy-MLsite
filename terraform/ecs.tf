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
  cpu                      = 256
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      "name" : "webapp"
      "image" : "${aws_ecr_repository.ecr_backend_app.repository_url}:latest"
      "memory" : 512
      "essential" : true,
      "command" : ["./startup.sh"],
      "environment" : [
        {
          "DB_NAME" : "${var.db_name}",
          "DB_HOST" : "${aws_db_instance.mariadb_instance.address}",
          "DB_USER" : "${var.db_username}",
          "DB_PASSWORD" : "${random_string.db_password.result}",
          "DB_PORT" : 3306,
          "AWS_ACCESS_KEY_ID" : "${var.aws_access_key_id}",
          "AWS_SECRET_ACCESS_KEY" : "${var.aws_secret_access_key}",
          "AWS_STORAGE_BUCKET_NAME" : "${aws_s3_bucket.s3_image_learn_bucket.bucket_domain_name}",
          "MYAPP_DOMAIN" : "${var.route53_domain}",
          "DEBUG" : false
        }
      ],
      portMappings = [
        {
          containerPort = 8000
        }
      ]
    },
    {
      "name" : "frontend"
      "image" : "${aws_ecr_repository.ecr_front_app.repository_url}:latest"
      "memory" : 512
      "essential" : true,
      "command" : ["./startup.sh"],
      "environment" : [
        {
          "NEXT_PUBLIC_FIREBASE_API_KEY" : "${var.firebase_api_key}",
          "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" : "${var.firebase_auth_domain}",
          "NEXT_PUBLIC_FIREBASE_PROJECT_ID" : "${var.firebase_project_id}",
          "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" : "${var.firebase_storage_bucket}",
          "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" : "${var.firebase_messaging_sender_id}",
          "NEXT_PUBLIC_FIREBASE_APP_ID" : "${var.firebase_app_id}",
          "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" : "${var.firebase_measurement_id}",
          "NEXT_PUBLIC_URL" : "${var.route53_domain}",
          "INTERNAL_URL" : "localhost",
          "NEXT_PUBLIC_S3_STATIC_URL" : "${aws_s3_bucket.s3_image_static_bucket.bucket_regional_domain_name}",
          "NEXT_PUBLIC_S3_LEARN_URL" : "${aws_s3_bucket.s3_image_learn_bucket.bucket_regional_domain_name}"
        }
      ],
      portMappings = [
        {
          containerPort = 3000
        }
      ],
      "dependsOn" : [
        {
          "containerName" : "webapp"
          "condition" : "HEALTHY"
        }
      ]
    }
  ])
}

#ECS-Service
resource "aws_ecs_service" "ecs_fargate_service" {
  name            = "${var.project}-myapp-ecs-serice"
  cluster         = aws_ecs_cluster.ecs_cluster.arn
  task_definition = aws_ecs_task_definition.ecs_task_def.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  deployment_minimum_healthy_percent = 50
  health_check_grace_period_seconds  = 60

  network_configuration {
    security_groups = [aws_security_group.app_sg.id]
    subnets = [
      aws_subnet.private_subnet_1a_app.id,
      aws_subnet.private_subnet_1c_app.id,
    ]
    assign_public_ip = false
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
      task_definition,
      load_balancer,
    ]
  }
}