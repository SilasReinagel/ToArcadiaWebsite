---
layout: default
title: "Early Access"
permalink: early.html
---

<section id="early-access" class="mt2 center-all column">
  <h1 class="script">Early Access</h1>

  <form id="login" class="card white-bg mt4 hidden">
    <div class="column">
      <label for="uname"><b>Username</b></label>
      <input id="username" type="text" placeholder="Enter Username" name="uname" required>
      <label for="psw"><b>Password</b></label>
      <input id="password" type="password" placeholder="Enter Password" name="psw" required>
      <button id="login-button" type="submit">Login</button>
    </div>
  </form>

  <div id="protected" class="measure hidden column center-all">
    {% include audioplayer.html %}

    <section class="wallpaper card white-bg mt4">
      <h2 class="mt1 mb1 center script">Here With Me - Wallpaper</h2>
      <div class="column">
        <img class="mb2" src="/images/wallpaper/HereWithMe-thumb.jpg"/>
        <div class="center-all mb1 mt1">
          <a class="order-button" target="_blank" href="/images/wallpaper/HereWithMe-1080p.jpg" download>HD</a>
          <a class="order-button" onClick="window.location='/images/wallpaper/HereWithMe-4k.jpg'" download>4K</a>
        </div>
      </div>
    </section>

    <div class="light mt3 mb2"><button id="logout-button" class="order-button" onClick="logout()">Log Out</button></div>
  </div>
</section>

<script defer src="/js/early-login.js"></script>

