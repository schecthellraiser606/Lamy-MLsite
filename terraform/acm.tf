resource "aws_acm_certificate" "cert" {
  domain_name       = "${var.route53_domain}"
  validation_method = "DNS"

  tags = {
    Name = "${var.project}-wildcard-sslcert"
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_route53_zone.route53_zone
  ]
}