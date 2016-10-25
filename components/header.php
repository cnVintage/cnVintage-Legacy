<?php 
    include_once '/charset.php';
?>
<!-- Top links and search -->
<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#337000" height="54px" valign="bottom">
    <tr>
        <td height="40" width="20">&nbsp;</td>
            <td height="40" width="220">
            <div align="left"><img src="cnvtg.jpg"> 
                <font color="#FFFFFF"><?php localprint('简易版') ?></font>
            </div>
        </td>
        <td height="40"> 
            <div align="right">
                <input type="text" name="textfield" value="Search">
                <input type="submit" name="Submit" value="<?php localprint('搜索') ?>">
                <a href="login.php"><font color="#FFFFFF"><?php localprint('登陆') ?></font></a>
                <a href="login.php"><font color="#FFFFFF"><?php localprint('注册') ?></font></a>
            </div>
        </td>
        <td height="40" width="20">&nbsp;</td>
    </tr>
</table>
