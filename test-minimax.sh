#!/bin/bash
source server/.env
curl -X POST "https://api.minimax.chat/v1/text/chatcompletion_pro?GroupId=${2024863326390985144}" \
  -H "Authorization: Bearer ${MINIMAX_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "abab6.5s-chat",
    "messages": [{"sender_type": "USER", "sender_name": "User", "text": "Hello"}]
  }'
