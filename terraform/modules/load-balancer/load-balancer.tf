data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "load-balancer-access" {
  name = "${var.app_name}-${var.app_environment_name}-lb-access-${var.balancing_module_name}"

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "module_target_group" {
  name     = "${var.app_name}-${var.app_environment_name}-lb-tg-${var.balancing_module_name}"
  
  target_type = "instance"

  protocol = "HTTP"
  port     = var.balancing_module_port

  vpc_id   = data.aws_vpc.default.id
}

resource "aws_lb_target_group_attachment" "module_instance_attachment" {
  for_each = var.balancing_module_target_ids

  target_group_arn = aws_lb_target_group.module_target_group.arn
  target_id        = each.key
  port             = var.balancing_module_port
}

resource "aws_lb" "module_alb" {
  name               = "${var.app_name}-${var.app_environment_name}-alb"
  
  internal           = false
  load_balancer_type = "application"

  security_groups    = [aws_security_group.load-balancer-access.id]
  subnets            = data.aws_subnets.default.ids

  enable_deletion_protection = false

  tags = {
    Name = "${var.app_name}-${var.app_environment_name}-alb"
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.module_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.module_target_group.arn
  }
}
