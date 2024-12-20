output "public_ip" {
  value = aws_instance.instance-backend.public_ip
}

output "security_group" {
  value = aws_security_group.instance-backend-access
}

output "instance" {
  value = aws_instance.instance-backend
}
