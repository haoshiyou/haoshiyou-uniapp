<template>
    <div class="wrapper" itemscope itemtype="https://schema.org/Room">
        <div class="grid-container">
            <div class="content">
                <div itemprop="name" class="title">{{ title || "no title" }}</div>
                <div class="middle">
                    <!----><!---->
                    <span name="ios-pin-outline" role="img" class="icon icon-ios ion-ios-pin-outline"
                          aria-label="pin outline"></span><span itemprop="geo" class="location">{{ location || "no location" }}</span>

                    <span name="ios-time-outline" role="img" class="icon icon-ios ion-ios-time-outline"
                          aria-label="time outline"></span><span class="lastUpdate">{{ updated || "no time" }}</span>
                </div>
                <div class="price">
                    <!----><!---->
                    <span class="price-dollar-number-per">{{ price || `no price` }}</span><span class="month">/月</span>

                    <!---->
                </div>
            </div>
            <div class="thumbnail">
                <img itemprop="image" alt="" src="/img/no-photo-placeholder.jpg"
                     style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
            </div>
            <a itemscope itemprop="identifier" href=""></a>
        </div>
    </div>
</template>

<style>

</style>
