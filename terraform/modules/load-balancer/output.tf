output "load_balancer_security_group_id" {
  value = aws_security_group.load-balancer-access.id
}

output "load_balancer" {
  value = aws_lb.module_alb
}
