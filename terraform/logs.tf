resource "aws_cloudwatch_log_group" "fargate_cluster_log_group" {
  name = "${var.project}-cluster-log-group"
}

# resource "aws_cloudwatch_log_stream" "webapp" {
#   name           = "webapp-container-log-stream"
#   log_group_name = aws_cloudwatch_log_group.fargate_cluster_log_group.name
# }

# resource "aws_cloudwatch_log_stream" "frontend" {
#   name           = "frontend-container-log-stream"
#   log_group_name = aws_cloudwatch_log_group.fargate_cluster_log_group.name
# }