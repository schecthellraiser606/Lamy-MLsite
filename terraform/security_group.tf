#web

resource "aws_security_group" "web_sg" {
  name        = "${var.project}-web-sg"
  description = "web role security group"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name    = "${var.project}-web-sg"
    Project = var.project
  }
}

resource "aws_security_group_rule" "web_in_icmp" {
  security_group_id = aws_security_group.web_sg.id
  type              = "ingress"
  protocol          = "icmp"
  from_port         = -1
  to_port           = -1
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "web_in_http" {
  security_group_id = aws_security_group.web_sg.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "web_in_https" {
  security_group_id = aws_security_group.web_sg.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 443
  to_port           = 443
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "web_in_tcp8000" {
  security_group_id = aws_security_group.web_sg.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 8000
  to_port           = 8000
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "web_out_all" {
  security_group_id = aws_security_group.web_sg.id
  type              = "egress"
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  cidr_blocks       = ["0.0.0.0/0"]
}

#app
resource "aws_security_group" "app_sg" {
  name        = "${var.project}-app-sg"
  description = "app role security group"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name    = "${var.project}-app-sg"
    Project = var.project
  }
}

resource "aws_security_group_rule" "app_in_tcp3000" {
  security_group_id        = aws_security_group.app_sg.id
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = 3000
  to_port                  = 3000
  source_security_group_id = aws_security_group.web_sg.id
}

resource "aws_security_group_rule" "app_in_tcp8000" {
  security_group_id        = aws_security_group.app_sg.id
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = 8000
  to_port                  = 8000
  source_security_group_id = aws_security_group.web_sg.id
}


resource "aws_security_group_rule" "app_in_http" {
  security_group_id = aws_security_group.app_sg.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 80
  to_port           = 80
  source_security_group_id = aws_security_group.web_sg.id
}
resource "aws_security_group_rule" "app_in_https" {
  security_group_id = aws_security_group.app_sg.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 443
  to_port           = 443
  source_security_group_id = aws_security_group.web_sg.id
}


resource "aws_security_group_rule" "app_in_db" {
  security_group_id        = aws_security_group.app_sg.id
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = 3306
  to_port                  = 3306
  source_security_group_id = aws_security_group.db_sg.id
}

resource "aws_security_group_rule" "app_out_all" {
  security_group_id        = aws_security_group.app_sg.id
  type                     = "egress"
  protocol                 = "-1"
  from_port                = 0
  to_port                  = 0
  cidr_blocks = ["0.0.0.0/0"]
}


#db
resource "aws_security_group" "db_sg" {
  name        = "${var.project}-db-sg"
  description = "db role security group"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name    = "${var.project}-db-sg"
    Project = var.project
  }
}

resource "aws_security_group_rule" "db_in_tcp3306" {
  security_group_id        = aws_security_group.db_sg.id
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = 3306
  to_port                  = 3306
  source_security_group_id = aws_security_group.app_sg.id
}

resource "aws_security_group_rule" "db_out_tcp3306" {
  security_group_id        = aws_security_group.db_sg.id
  type                     = "egress"
  protocol                 = "tcp"
  from_port                = 3306
  to_port                  = 3306
  source_security_group_id = aws_security_group.app_sg.id
}