<?php 
    include_once '/charset.php';
?>
<!-- Header -->
<center>
    <table><tr>
        <td><h1 class="header">cnVintage</h1></td>
        <td><h5 class="header">Legacy</h5></td>
    </tr></table>
<center>
<!-- Top links and search -->
<center>
    <table><tr>
        <td><a href="#"><?php localprint('社区') ?></a></td>
        <td><a href="#"><?php localprint('资源站') ?></a></td>
        <td><form action="search.php" method="get">
            <input type="text" name="s" value="Search"></input>
            <input type="submit" value="<?php localprint('搜索') ?>"></input>
        <form></td>
        <td><a href="#"><?php localprint('注册') ?></a></td>
        <td><a href="#"><?php localprint('登陆') ?></a></td>
    </tr></table>
<center>
