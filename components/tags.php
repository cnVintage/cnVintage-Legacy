<?php 
    include_once '/charset.php';
?>
<!-- Tags -->
<!-- TODO: Load data from MySQL instead of hard code like below. -->
<?php function require_tags() { ?>
<table width="100%" height="30" bgcolor="#337000" border="0" cellspacing="0" cellpadding="0"><tbody><tr>
    <td>
        <div align="center"><b><font color="#ffffff"><?php localprint('新的话题') ?></font></b></div>
    </td>
</tr></tbody></table>
<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody>
        <tr><td width="30" bgcolor="#aaaaaa"></td><td width="10"></td><td height="30"><?php localprint('所有话题') ?></td></tr>
        <tr><td width="30" bgcolor="#003366"></td><td width="10"></td><td height="30"><?php localprint('机器展示') ?></td></tr>
        <tr><td width="30" bgcolor="#FF9900"></td><td width="10"></td><td height="30"><?php localprint('介绍分享') ?></td></tr>
        <tr><td width="30" bgcolor="#009999"></td><td width="10"></td><td height="30"><?php localprint('改装自制') ?></td></tr>
        <tr><td width="30" bgcolor="#99CC33"></td><td width="10"></td><td height="30"><?php localprint('新潮数码') ?></td></tr>
        <tr><td width="30" bgcolor="#333333"></td><td width="10"></td><td height="30"><?php localprint('一般讨论') ?></td></tr>
</tbody></table>
<?php }?>
