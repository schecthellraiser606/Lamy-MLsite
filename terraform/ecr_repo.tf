resource "aws_ecr_repository" "ecr_repo" {
  name                 = "${var.project}-myapp"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name    = "${var.project}-ecr"
    Project = var.project
  }
}