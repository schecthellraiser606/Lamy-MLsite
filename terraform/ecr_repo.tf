#next
resource "aws_ecr_repository" "ecr_front_app" {
  name                 = "${var.project}-front-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name    = "${var.project}-front-app-ecr"
    Project = var.project
  }
}

#django
resource "aws_ecr_repository" "ecr_backend_app" {
  name                 = "${var.project}-backend-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name    = "${var.project}-backend-app-ecr"
    Project = var.project
  }
}