#!/bin/bash
cd "$(dirname "$0")"

git pull https://${LC_github_key}:x-oauth-basic@github.com/Graicc/kesto

sudo -v

sudo cp ~/kesto/Kesto.service /etc/systemd/system/Kesto.service

sudo systemctl daemon-reload
sudo systemctl restart Kesto.service
