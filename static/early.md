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
    <div class="light mt4"><button id="logout-button" class="order-button" onClick="logout()">Log Out</button></div>
  </div>
</section>

<script defer src="/js/early-login.js"></script>

