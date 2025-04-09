<?php

$sample = file_get_contents("./grid-data.json");

?>
<body>

</body>
<script src="scripts/dotpipe.js"></script>
<script>    
    modala(<?= $sample ?>, document.body);
</script>