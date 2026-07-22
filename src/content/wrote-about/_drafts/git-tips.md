---
tags: draft
permalink: false
title: "Git tips I keep coming back to"
topics: ["webdev"]
when: soon
order: 7
highlightDraft: true
---

Some commands that I keep forgetting and have to look up.

<!-- excerpt -->

## Update feature branch from main branch

```
// Switch to main branch
$ git checkout main

// Get updates from the origin repository
$ git fetch -p origin

// Ensure local main is up-to-date with main on the origin repository
$ git merge origin/main

// Switch to the feature branch to be updated
$ git checkout feature-branch

// Merge any updates from the main branch into the feature branch
$ git merge main

// Push all changes of the local feature branch the origin repository
$ git push origin feature-branch
```