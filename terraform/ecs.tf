resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project}-myapp-cluster"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.project}-myEcsTaskRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "amazon_ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_task_definition" "ecs_task_def" {
  family                   = "${var.project}-myapp-task-def"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

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
}