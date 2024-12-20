resource "aws_security_group" "instance-backend-access" {
  name = "${var.app_name}-${var.app_environment_name}-backend-access"

  ingress {
    description = "Allow SSH access from dedicated IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [format("%s/32", var.allowed_direct_access_connection_ip)]
  }

  ingress {
    description = "Allow inbound traffic from API gateway"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    security_groups = [var.module_load_balancer_security_group_id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "instance-backend" {
  ami           = var.ami_id
  instance_type = "t2.micro"

  key_name = var.key_pair_name

  vpc_security_group_ids = [aws_security_group.instance-backend-access.id]
  associate_public_ip_address = true

  tags = {
    Name = "${var.app_name}-${var.app_environment_name}-instance-backend"
  }

  provisioner "remote-exec" {
    inline = [ "echo 'Wait until SSH is ready'" ]

    connection {
      type    = "ssh"
      user = "ubuntu"
      private_key = file(var.key_pair_file_path)
      host = aws_instance.instance-backend.public_ip
    }
  }

  provisioner "local-exec" {
    command = "ansible-playbook -i ${aws_instance.instance-backend.public_ip}, --private-key ${var.key_pair_file_path} ${var.ansible_playbook_path}/backend-prepare.yml"
  }

  provisioner "local-exec" {
    command = "ansible-playbook -i ${aws_instance.instance-backend.public_ip}, --private-key ${var.key_pair_file_path} ${var.ansible_playbook_path}/backend-start.yml"
  }
}
