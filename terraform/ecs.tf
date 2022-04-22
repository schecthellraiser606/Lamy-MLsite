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
      "memory" : 768
      "essential" : true,
      portMappings = [
        {
          containerPort = 8000
        }
      ]
    },
    {
      "name" : "frontend"
      "image" : "${aws_ecr_repository.ecr_front_app.repository_url}:latest"
      "memory" : 256
      "essential" : true,
      portMappings = [
        {
          containerPort = 3000
        }
      ]
    }
  ])
}

#ECS-Service
resource "aws_ecs_service" "ecs_service" {
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
}