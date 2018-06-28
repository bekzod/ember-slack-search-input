import { bool } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, observer, set, get } from '@ember/object';
import { run } from '@ember/runloop';
import layout from './template';

export default Component.extend({
  layout: layout,
  currentIndex: -1,
  classNames: ['hint-menu-container'],
  isVisible: bool('token.hints.length'),

  correctScroll: observer('currentIndex', function() {
    run.scheduleOnce('afterRender', this, function() {
      let currentIndex = get(this, 'currentIndex');
      if (currentIndex === -1 || !this.element) { return; }
      let $listItem = this.$('li').eq(currentIndex);
      let $list = $listItem.parent('.slack-search-input-list');

      let scroll = $list.scrollTop();
      let listHeight = $list.height();

      let itemHeight = $listItem.outerHeight();
      let top = $listItem.position().top;
      let bottom = top + itemHeight;

      if (top < 0) {
        $list.scrollTop(scroll + top);
      } else if (listHeight < bottom) {
        $list.scrollTop(scroll + top - listHeight + itemHeight);
      }
    });
  }),

  select: observer('enterClicked', function() {
    let list = get(this, 'flatList');
    let currentIndex = get(this, 'currentIndex');
    if (currentIndex !== -1) {
      let item = list.objectAt(currentIndex);
      let token = get(this, 'token');
      run.schedule('sync', this, function() {
        this.attrs.changeTokenModel(token, item, true);
      });
    }
  }),

  goUp: observer('upClicked', function() {
    let len = get(this, 'flatList.length');
    if (!len) { return; }
    let currentIndex = get(this, 'currentIndex') % len;
    if (currentIndex <= 0) {
      set(this, 'currentIndex', len - 1);
    } else {
      set(this, 'currentIndex', currentIndex - 1);
    }
    this.attrs['on-focus']();
  }),

  goDown: observer('downClicked', function() {
    let len = get(this, 'flatList.length');
    if (!len) { return; }
    let currentIndex = get(this, 'currentIndex');
    if (currentIndex >= (len - 1)) {
      set(this, 'currentIndex', 0);
    } else {
      set(this, 'currentIndex', currentIndex + 1);
    }
    this.attrs['on-focus']();
  }),

  flatList: computed('listGrouped', function() {
    return get(this, 'listGrouped').reduce(function(sum, item) {
      return sum.concat(item.list);
    }, []);
  }),

  listGrouped: computed('token.hints', function() {
    let hints = get(this, 'token.hints');
    if (!hints) { return []; }
    let list = hints
      .reduce(function (sum, listItem) {
        let section = listItem.section;
        if (section) {
          if (sum[section]) {
            sum[section].push(listItem);
          } else {
            sum[section] = [listItem];
          }
        } else {
          sum['untitled'].push(listItem);
        }
        return sum;
      }, { 'untitled': [] });

    let listArray = [];
    for (let key in list) {
      listArray.push({ section: key, list: list[key] });
    }
    listArray.findBy('section', 'untitled').section = '';
    let t = 0;
    let array = listArray.sortBy('section').reverse()
      .map(function(section) {
        section.list = section.list.map(function(list) {
          set(list, 'index', t++);
          return list;
        });
        return section;
      });
    return array;
  }),

  actions: {
    selectItem(index) {
      set(this, 'currentIndex', index);
      this.select();
      return false;
    }
  }

});
