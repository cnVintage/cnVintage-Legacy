<?php 
    include_once '/charset.php';
?>
<html>
    <head>
        <title>cnVintage</title>
        <link rel="stylesheet" href="style/main.css">
    </head>
    <body>
        <?php include '/components/header.php'; ?>
        <!-- Page body -->
        <center>
            <table width="600px">
            <tr>
                <td width="20%" style="text-align: center"><?php localprint('所有话题') ?></td>
                <td width="80%" style="text-align: center"><?php localprint('所有帖子') ?></td>
            </tr>
            <tr>
                <td align="left" valign="top"><?php include '/components/tags.php'; ?></td>
                <td align="left" valign="top"><?php include '/components/topics.php'; ?></td>
            </tr>
            </table>
        <center>
    </body>

</html>
