# Roadmap Feedback Worker

This Worker receives roadmap feedback from the docs site and forwards it to Discord.

Required secret:

```bash
wrangler secret put DISCORD_WEBHOOK_URL
```

Deploy:

```bash
wrangler deploy
```

After deployment, add the Worker URL to the GitHub repository secret:

```txt
ROADMAP_FEEDBACK_ENDPOINT=https://your-worker-url.workers.dev
```
