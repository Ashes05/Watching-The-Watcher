function UiScreen(props) {
    return (
      <Page>
        <Section>
          <TextInput label="User ID" settingsKey="UserID"/>
        </Section>
      </Page>
    );
  }
  
  registerSettingsPage(UiScreen);