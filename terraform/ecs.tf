resource "aws_ecs_cluster" "ecs_container" {
  name = "${var.project}-myapp"
}