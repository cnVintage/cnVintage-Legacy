<?php 
    include_once '/charset.php';
?>
<!-- Tags -->
<?php function require_tags() { 
    // Create database connection.
    $conn = new mysqli("127.0.0.1", "root", "", "forum");

    if ($conn->connect_error) {
        die('<h1>建立与数据库的链接失败！</h1>');
    }

    // Set the correct charset.
    $conn->set_charset("utf8");

    // Grab all tags from database.
    $res = $conn->query("SELECT * FROM fl_tags");

    // HTML code
?>
<!-- Table for new topic, like <div> in modern HTML -->
<table width="100%" height="30" bgcolor="#337000" border="0" cellspacing="0" cellpadding="0"><tbody><tr>
    <td>
        <div align="center"><b><font color="#ffffff"><?php localprint('新的话题') ?></font></b></div>
    </td>
</tr></tbody></table>
<br>
<!-- Table for tags list -->
<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody>
        <tr><td width="30" bgcolor="#aaaaaa"></td><td width="10"></td><td height="30"><?php localprint('所有话题') ?></td></tr>
        <?php
        // filling the table with tags readed from database.
        while ($row = $res->fetch_assoc()) {
        ?>
            <tr><td width="30" bgcolor="<?php localprint($row["color"]) ?>"></td><td width="10"></td><td height="30"><?php localprint($row["name"]) ?></td></tr>
        <?php
        } // end of while
        ?>
</tbody></table>
<?php 
} // end of require_tags
?>
