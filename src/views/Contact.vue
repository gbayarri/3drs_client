<template>
  <div class="main container">
    <h1>{{ header }}</h1>
    <Breadcrumb :home="home" :model="breadcrumbs" class="p-mb-3" />  
    <Panel class="p-shadow-2 p-mb-3" id="header-contact">
      <template #header>
          <i class="fas fa-paper-plane"></i> <div class="p-panel-title">{{ contactPanel.header }}</div>
      </template>
      <div class="p-grid">
        <div class="p-col">
          <p>For any topic related to <strong>{{ contactPanel.longName }}</strong>, please 
          <a v-bind:href="contactPanel.newIssue" target="_blank" style="font-weight: bold;">open a new issue</a> in our 
          <a v-bind:href="contactPanel.gitHubRepo" target="_blank" style="font-weight: bold;">GitHub repo</a> and we will 
          get back to you as soon as possible. Before opening a new issue, we <strong>strongly recommend</strong> you to 
          <a v-bind:href="contactPanel.issuesList" target="_blank" style="font-weight: bold;">check the rest of issues</a>.</p>

          <p><Button type="button" :label="contactPanel.labelIssues" icon="pi pi-github" @click="openRepo" /></p>

          <p><Button type="button" :label="contactPanel.labelNewIssue" icon="pi pi-github" @click="openNewIssue" /></p>
        </div>
      </div>
    </Panel>
  </div>
  <Footer />
</template>

<script>
import globals from '@/globals'
export default {
  components: {  },
  setup() {

    const header = "Contact Us"

    const home = { icon: 'pi pi-home', to: { name: 'About'} }
    const breadcrumbs = [
        { label: 'Contact', to: { name: 'Contact'}}
    ]

    const contactPanel = {
      header: globals.shortName + " contact",
      longName: globals.longName,
      labelIssues: "Check " + globals.shortName + " GitHub issues",
      labelNewIssue: "Open new issue in " + globals.shortName + " GitHub",
      newIssue: process.env.VUE_APP_GITHUB_NEW_ISSUE_URL,
      gitHubRepo: process.env.VUE_APP_OFFICIAL_URL,
      issuesList: process.env.VUE_APP_GITHUB_ISSUES_URL
    }

    const openRepo = () => {
      window.open(process.env.VUE_APP_GITHUB_ISSUES_URL, '_blank')
    }

    const openNewIssue = () => {
      window.open(process.env.VUE_APP_GITHUB_NEW_ISSUE_URL, '_blank')
    }

    return { header, contactPanel, home, breadcrumbs, openRepo, openNewIssue }
  }
}
</script>

<style>

</style>