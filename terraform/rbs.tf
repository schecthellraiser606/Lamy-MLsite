resource "aws_db_parameter_group" "mariadb_parametergroup" {
  name   = "${var.project}-mariadb-parametergroup"
  family = "mariadb10.6"

  parameter {
    name  = "character_set_database"
    value = "utf8mb4"
  }

  parameter {
    name  = "character_set_server"
    value = "utf8mb4"
  }

  parameter {
    apply_method = "immediate"
    name         = "max_allowed_packet"
    value        = "104857600"
  }
}

# resource "aws_db_option_group" "mariadb_optiongroup" {
#   name                     = "${var.project}-mariadb-optiongroup"
#   option_group_description = "${var.project}-Option Group"
#   engine_name              = "mariadb"
#   major_engine_version     = "10.6"

#   option {
#     option_name = "timezone"

#     option_settings {
#       name  = "TIME_ZONE"
#       value = "Asia/Tokyo"
#     }
#   }
# }

resource "aws_db_subnet_group" "mariadb_subnetgroup" {
  name = "${var.project}-mariadb-subnetgroup"
  subnet_ids = [
    aws_subnet.private_subnet_1a_db.id,
    aws_subnet.private_subnet_1c_db.id
  ]

  tags = {
    Name    = "${var.project}-mariadb-subnetgroup"
    Project = var.project
  }
}

resource "random_string" "db_password" {
  length  = 16
  special = false
}

resource "aws_db_instance" "mariadb_instance" {
  engine         = "mariadb"
  engine_version = "10.6"

  identifier = "${var.project}-mariadb-instance"

  username = var.db_username
  password = random_string.db_password.result

  instance_class        = "db.t2.micro"
  allocated_storage     = 5
  max_allocated_storage = 20
  storage_type          = "gp2"
  storage_encrypted     = false

  multi_az          = false
  availability_zone = "ap-northeast-1a"

  db_subnet_group_name   = aws_db_subnet_group.mariadb_subnetgroup.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  publicly_accessible    = false
  port                   = 3306

  name                 = var.db_name
  parameter_group_name = aws_db_parameter_group.mariadb_parametergroup.name
  # option_group_name    = aws_db_option_group.mariadb_optiongroup.name

  backup_window              = "02:00-03:00"
  backup_retention_period    = 7
  maintenance_window         = "Mon:03:00-Mon:06:00"
  auto_minor_version_upgrade = false

  deletion_protection = false
  skip_final_snapshot = true

  apply_immediately = true

  tags = {
    Name    = "${var.project}-mariadb-insatance"
    Project = var.project
  }

}