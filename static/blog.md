---
layout: default
title: "To Arcadia - Creation Blog"
permalink: blog.html
---

<div class="landing container">
    {% for post in paginator.posts %}
    <div class="card post ">
      <a href="{{ post.url | prepend: site.baseurl }}" class="featured-post post-link light-bg">
        <div class="py2 px2">    
          <p class="post-meta">{{ post.date | date: site.date_format }}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {% include read_time.html content=post.content %}
          </p>
          <div class="container mb1 py1"><div><img class="post-featured-img" src="{{ post.featured-img }}" alt="Post Featured Image"></div></div>
          <h2 class="h2 post-title center">{{ post.title }}</h2>
          {{ post.excerpt }}
          <p class="read-more">READ MORE</p>
        </div>
      </a>
    </div>
    {% endfor %}

    {% include pagination.html %}
</div>

