#ALB
resource "aws_lb" "alb" {
  name               = "${var.project}-app-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups = [
    aws_security_group.web_sg.id
  ]
  subnets = [
    aws_subnet.public_subnet_1a_app.id,
    aws_subnet.public_subnet_1c_app.id
  ]

  access_logs {
    bucket  = aws_s3_bucket.s3_ALB_log_buckets.id
    prefix  = "access_log"
    enabled = true
  }
}

#target group
resource "aws_lb_target_group" "alb_target_group_front" {
  name        = "${var.project}-front-target"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.vpc.id

  health_check {
    interval            = 180
    path                = "/"
    protocol            = "HTTP"
    timeout             = 120
    unhealthy_threshold = 2
    matcher             = 200
  }

  tags = {
    Name    = "${var.project}-front-target"
    Project = var.project
  }
}

resource "aws_lb_target_group" "alb_target_group_backend" {
  name        = "${var.project}-backend-target"
  port        = 8000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.vpc.id

  health_check {
    interval            = 180
    path                = "/aiapps"
    protocol            = "HTTP"
    timeout             = 120
    unhealthy_threshold = 2
    matcher             = 200
  }


  tags = {
    Name    = "${var.project}-backend-target"
    Project = var.project
  }
}

resource "aws_alb_listener" "alb_listener_http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "alb_listener_https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_target_group_front.arn
  }
}

resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.alb_listener_https.arn
  priority = 100

  action {
    type = "forward"
    target_group_arn = aws_lb_target_group.alb_target_group_backend.arn
  }

  condition {
    path_pattern {
      values = ["/aiapps/*"]
    }
  }
}