#ALB
resource "aws_lb" "alb" {
  name               = "${var.project}-app-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups = [
    aws_security_group.web_sg.id
  ]
  subnets = [
    aws_subnet.private_subnet_1a_app.id,
    aws_subnet.private_subnet_1c_app.id
  ]
}