# Route53

resource "aws_route53_zone" "route53_zone" {
  name          = var.route53_domain
  force_destroy = false

  tags = {
    Name    = "${var.project}-domain"
    Project = var.project
  }
}

resource "aws_route53_record" "route53_record" {
  zone_id = aws_route53_zone.route53_zone.id
  name    = "www.${var.domain}"
  type    = "A"

  alias {
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = true
  }
}