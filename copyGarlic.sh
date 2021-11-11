#!/bin/sh

source .env

ssh -o "SendEnv LC_github_key" -t garlic ~/kesto/publishGarlic.sh