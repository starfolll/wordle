resource "aws_route53_zone" "dns_zone" {
  name = var.domain
}

resource "aws_route53_record" "dns_record" {
  zone_id = aws_route53_zone.dns_zone.zone_id
  
  name    = var.record_name
  type    = "A"

  alias {
    name                   = var.module_load_balancer_dns_name
    zone_id                = var.module_load_balancer_zone_id
    evaluate_target_health = true
  }
}
