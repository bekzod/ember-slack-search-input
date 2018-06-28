import Controller from '@ember/controller';

export default Controller.extend({
  searchConfig: {
    "@": {
      type: 'list',
      defaultHint: 'any user',
      sectionTitle: 'Users',
      content: [
        {value: 'abrahm', label: 'Abrahm Micanski' },
        {value: 'lilly', label: 'Lilly Richards' },
        {value: 'emma', label: 'Emma Roberts' },
      ]
    },

    "before:": {
      type: 'date',
      defaultHint: 'a date',
    },

    "after:": {
      type: 'date',
      defaultHint: 'a date',
    },

    "channel:": {
      type: 'list',
      defaultHint: 'type',
      sectionTitle: 'Channels',
      content: [
        {value: 'ember', label: 'ember'},
        {value: 'jobs', label: 'jobs'},
        {value: 'general', label: 'general'},
        {value: 'news', label: 'news'}
      ]
    }
  },

});
