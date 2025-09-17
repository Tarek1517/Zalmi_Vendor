<script setup>
// No script needed for static affiliate footer
</script>

<template>
  <footer>
    <section class="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="flex flex-col lg:flex-row justify-between gap-10">
          <!-- Logo & About -->
          <div class="w-full lg:w-1/3 text-center lg:text-left">
            <img
              src="@/assets/images/logo.png"
              alt="Affiliate Logo"
              class="h-16 mx-auto lg:mx-0 mb-4"
            />
            <p
              class="text-sm leading-relaxed max-w-sm mx-auto lg:mx-0"
            >
              We partner with leading brands to bring you exclusive affiliate
              deals and the best recommendations in the digital space.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="w-full lg:w-1/3 text-center lg:text-left">
            <h4 class="font-bold text-lg mb-4">Quick Links</h4>
            <ul class="text-white/80 space-y-2 text-sm ">
              <li><a href="/" class="hover:text-primary">Home</a></li>
              <li><a href="/about" class="hover:text-primary">Terms & Condition</a></li>
              <li>
                <a href="/partners" class="hover:text-primary">Privacy & Policy</a>
              </li>
              
            </ul>
          </div>

          <!-- Affiliate Disclosure -->
          <div class="w-full lg:w-1/3 text-center lg:text-left">
            <h4 class="font-bold text-lg mb-4">
              Affiliate Disclaimer
            </h4>
            <p class="text-sm text-white/80 leading-relaxed">
              Some of the links on our site are affiliate links. This means if
              you click on them and make a purchase, we may earn a commission at
              no additional cost to you. We only recommend products we trust.
            </p>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div
          class="mt-10 pt-6 border-t border-gray-300 flex flex-col lg:flex-row items-center justify-between text-sm text-gray-500"
        >
          <div>© 2025 Affiliate Network. All rights reserved.</div>
          <div class="flex flex-col sm:flex-row gap-4 items-center">
            <p class="text-gray-400 text-sm mr-2">Download our app:</p>
            <div class="flex gap-3">
              <a
                href="#"
                class="bg-black hover:bg-gray-800 p-2 rounded-lg transition-colors"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Play Store"
                  class="h-8"
                />
              </a>
              <a
                href="#"
                class="bg-black hover:bg-gray-800 p-2 rounded-lg transition-colors"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  class="h-8"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </footer>
</template>
