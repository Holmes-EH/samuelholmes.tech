<?php require_once '../app/views/inc/header.php'; ?>

<div class="main">
    <div class="mainLogo">
        <img id="imgCont" src="<?php echo URLROOT; ?>/images/SHLogo-02.png" alt="Samuel Holmes Tech Logo">
    </div>
    <div class="mainTagCont" id="txtCont">
        <div class="mainTagline">
            <p class="tagline">Techniquement ?<br><br>Tout est possible...</p>
            <p class="desc">Solutions web sur mesure</p>
        </div>
    </div>
</div>

<script>
    $(window).on("load", function(){
        $("#txtCont").height($("#imgCont").height());
        $(window).resize(function() {
            $("#txtCont").height($("#imgCont").height());
        });
    });
    
</script>

<?php require_once '../app/views/inc/footer.php'; ?>