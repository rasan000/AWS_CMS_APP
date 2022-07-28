aws dynamodb create-table \
    --table-name iino-cms-table \
    --attribute-definitions \
        AttributeName=role,AttributeType=S \
        AttributeName=time_stamp,AttributeType=N \
        AttributeName=date,AttributeType=S \
        AttributeName=target,AttributeType=S \
        AttributeName=target_name,AttributeType=S \
        AttributeName=operator,AttributeType=S \
        AttributeName=telephone,AttributeType=S \
    --key-schema \
        AttributeName=role,KeyType=HASH \
        AttributeName=time_stamp,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --local-secondary-indexes \
        IndexName=date-index,KeySchema=["{AttributeName=role,KeyType=HASH}","{AttributeName=date,KeyType=RANGE}"],Projection={ProjectionType=ALL} \
        IndexName=target-index,KeySchema=["{AttributeName=role,KeyType=HASH}","{AttributeName=target,KeyType=RANGE}"],Projection={ProjectionType=ALL} \
        IndexName=target_name-index,KeySchema=["{AttributeName=role,KeyType=HASH}","{AttributeName=target_name,KeyType=RANGE}"],Projection={ProjectionType=ALL} \
        IndexName=operator-index,KeySchema=["{AttributeName=role,KeyType=HASH}","{AttributeName=operator,KeyType=RANGE}"],Projection={ProjectionType=ALL} \
        IndexName=telephone-index,KeySchema=["{AttributeName=role,KeyType=HASH}","{AttributeName=telephone,KeyType=RANGE}"],Projection={ProjectionType=ALL}