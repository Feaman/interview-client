<template lang="pug">
    .error-page.pa-4
      .error-page__image-container.flex.flex-center
        img.error-page__image(
          src="/images/crying-girl.jpg"
        )
      .error-page__error.column.no-wrap.text-center.full-height.pb-4
        .error-page__title.text-h3.text-weight-bold.mt-8 Awww... What the dragon?!
        .error-page__status-code.text-grey-7.mt-2 Calm down, it's just a {{ statusCode }} error.
        .error-page__message.text-h4.text-blue-5.font-size-28.ml-1.mt-4 {{ message }}
        .row.mt-6
          q-btn(
            @click="home"
            label="go to the main page"
            color="pink"
          )
          q-btn.ml-6(
            @click="reload"
            label="Reload page"
            color="pink"
          )
    </template>

<script setup lang="ts">
import { AxiosError } from 'axios'

const props = defineProps<{
    error: AxiosError | Error,
}>()
let message = ''
const statusCode = (props.error as AxiosError)?.status || 500
const code = (props.error as AxiosError)?.code || ''
if (statusCode === 401) {
  message = 'Page not found'
} else {
  message = props.error instanceof AxiosError ? props.error.response?.data?.message : props.error.message
}

function home() {
  window.location.href = '/'
}

function reload() {
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.error-page {
  width: 100%;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  overflow: auto;
  display: flex;
  box-shadow: inset 0 0 15px 5px rgba(0, 0, 0, 0.3);

  .error-page__image-container {
    overflow: hidden;
    min-height: 102px;
    width: 50%;

    .error-page__image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .error-page__error {
    width: 50%;
    position: relative;
    align-items: center;
    justify-content: center;

    .error-page__title {
      line-height: normal;
    }
  }

  .error-page__message {
    line-height: 32px;
  }
}

@media (max-width: 700px) {
  .error-page__title {
    font-size: 40px;
  }
}

@media (max-width: 600px) {
  .error-page__title {
    font-size: 30px;
  }
}

@media (max-width: 400px) {
  .error-page__title {
    font-size: 24px;
  }
}

@media (max-width: 1196px) {
  .error-page {
    flex-direction: column;

    .error-page__image-container {
      max-height: 30vh;
      max-height: calc(var(--vh, 1vh) * 30);
      width: 100%;
    }

    .error-page__error {
      justify-content: start;
      margin-top: 10%;
      width: 100%;
    }
  }
}
</style>
