#!/bin/bash
cd /home/kavia/workspace/code-generation/responsive-dashboard-with-authentication-242951-242965/website_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

