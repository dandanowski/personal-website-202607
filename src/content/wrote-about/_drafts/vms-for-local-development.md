---
tags: draft
permalink: false
title: "Virtual machines for local development with Multipass"
topics: ["webdev"]
when: soon
order: 8
highlightDraft: false
---

Rather than installing lots of software on your computer for testing different libraries and coding environments, virtual machines can be a good way to keep your host machine tidy.

<!-- excerpt -->

---

## Things
* Create virtual machine using **Ubuntu Multipass**
  * ```multipass launch -n [INSTANCE_NAME]```
* Set local domain names to the virtual machine
  * In ```/etc/hosts``` file add
    * ```VM.IP.ADDR.ESS madeup-local-domain```
* Install **WordPress** on the virtual machine

## Troubleshooting

* Ensure that ```multipassd``` has FullDiskAccess in Mac OSX System Settings

## References
* [Ubuntu Multipass](https://documentation.ubuntu.com/multipass)
* [How to edit Mac hosts file](https://kinsta.com/knowledgebase/edit-mac-hosts-file/)
* [How to install Wordpress on Ubuntu](https://ubuntu.com/tutorials/install-and-configure-wordpress)
* [Ensure Multipass has FullDiskAccess on OSX](https://github.com/craftcms/nitro/issues/148)
