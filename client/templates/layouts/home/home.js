/**
 * Created by xiaochen on 4/21/16.
 */
AdsLooper = {};
AdsLooper.data = [{
  name: 'asus_mb',
  path: '/resources/ads/ad_asus_pro_gaming_series_motherboard.png',
  color: 'rgba(5,5,5,1)'
},{
  name: 'intel_i7',
  path: '/resources/ads/ad_intel_6th_gen_core_i7.png',
  color: '#0665a5'
},{
  name: 'inwin',
  path: '/resources/ads/ad_inwin_hframe_2.0.png',
  color: '#000000'
}];

AdsLooper.default = 0;
AdsLooper.current = AdsLooper.default;

AdsLooper.reset = () => {
  AdsLooper.current = AdsLooper.default;
}

AdsLooper.next = () => {
  if (AdsLooper.current === 2) {
    AdsLooper.reset();
  } else {
    AdsLooper.current++;
  }
  return AdsLooper.data[AdsLooper.current];
}

AdsLooper.previous = () => {
  if (AdsLooper.current === 0) {
    AdsLooper.current = 2;
  } else {
    AdsLooper.current--;
  }

  return AdsLooper.data[AdsLooper.current];
}

Template.IbuyitHome.helpers({
    brands() {
      return [{
        logo: '/resources/brands/intel.png',
        link: ''
      },{
        logo: '/resources/brands/amd.png',
        link: ''
      },{
        logo: '/resources/brands/asus.png',
        link: ''
      },{
        logo: '/resources/brands/hp.png',
        link: ''
      },{
        logo: '/resources/brands/evga.png',
        link: '',
      },{
        logo: '/resources/brands/gigabyte.jpg',
        link: ''
      },{
        logo: '/resources/brands/logitech.png',
        link: ''
      },{
        logo: '/resources/brands/dell.png',
        link: ''
      },{
        logo: '/resources/brands/lg.png',
        link: ''
      },{
        logo: '/resources/brands/samsung.jpg',
        link: '',
      },{
        logo: '/resources/brands/philips.png',
        link: ''
      },];
    }
});

Template.IbuyitHome.events({
  'click .ads-arrow.ads-arrow-left'() {
      let adver = AdsLooper.previous();
      $('.home-adver').attr('src', adver.path);
      $('.category-nav-wrapper').attr('style', 'background-color:' + adver.color);
  },

  'click .ads-arrow.ads-arrow-right'() {
      let adver = AdsLooper.next();
      $('.home-adver').attr('src', adver.path);
      $('.category-nav-wrapper').attr('style', 'background-color:' + adver.color);
  }
});
