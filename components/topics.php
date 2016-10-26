<?php 
    include_once '/charset.php';

    // Grab all discussions info, will be used on index page.
    function require_all_topic() {
        // Create database connection.
        $conn = new mysqli("127.0.0.1", "root", "", "forum");

        if ($conn->connect_error) {
            die('<h1>建立与数据库的链接失败！</h1>');
        }

        // Set the correct charset.
        $conn->set_charset("utf8");

        // Grab all tags from database.
        $res = $conn->query("SELECT * FROM fl_discussions");

        // HTML code
?>

<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody>
<?php
    while ($row = $res->fetch_assoc()) {
        // Get the avatar and username from start_user_id
        $stmt = mysqli_prepare($conn, "SELECT avatar_path, username FROM fl_users WHERE id=?");
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "i", $row["start_user_id"]);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $avatar_path, $username);
            mysqli_stmt_fetch($stmt);
            mysqli_stmt_close($stmt);
        }
        // Find out who is the last one reply to the post.
        $stmt = mysqli_prepare($conn, "SELECT username FROM fl_users WHERE id=?");
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "i", $row["last_user_id"]);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $last_username);
            mysqli_stmt_fetch($stmt);
            mysqli_stmt_close($stmt);
        }
?>
<tr>
    <td width="50" height="50"><img width="50" height="50" src="<?php localprint($avatar_path);?>"></td>
    <td width="10"></td>
    <td> <font size="4"><?php localprint($row["title"]); ?></font><br>
    <font color="#89a970"><?php localprint($last_username . ' 回复于 ' . $row["last_time"]); ?></font>
    <?php 
        $stmt = mysqli_prepare($conn, "SELECT * FROM fl_discussions_tags INNER JOIN fl_tags WHERE fl_tags.id = fl_discussions_tags.tag_id AND discussion_id=?");
        mysqli_stmt_bind_param($stmt, "i", $row["id"]);
        mysqli_stmt_execute($stmt);
        $tags = mysqli_stmt_get_result($stmt);

        while ($tag = $tags->fetch_assoc()) {
            localprint('[' . $tag["name"] . ']');
        }

        mysqli_stmt_close($stmt);
    ?>
    </td>
    <td width="20">
    <img src="reply.jpg">&nbsp;<?php localprint($row["comments_count"])?>
    </td>
    <tr><td height="10"></td><td></td><td></td><td></td>
</tr>
<?php
    }
?>
</tbody></table>

<?php
    }
?>
<!-- Topics -->
