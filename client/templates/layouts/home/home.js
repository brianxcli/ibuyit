/**
 * Created by xiaochen on 4/21/16.
 */
AdsLooper = {};
AdsLooper.data = [{
  name: 'asus_mb',
  path: '/resources/ads/ad_asus_pro_gaming_series_motherboard.png',
  color: 'rgba(22,22,22,1)'
},{
  name: 'intel_i7',
  path: '/resources/ads/ad_intel_6th_gen_core_i7.png',
  color: '#0665a5'
},{
  name: 'inwin',
  path: '/resources/ads/ad_inwin_hframe_2.0.png',
  color: 'rgba(18,18,18,0.9)'
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
        link: '/product/search?brand=intel'
      },{
        logo: '/resources/brands/amd.png',
        link: '/product/search?brand=amd'
      },{
        logo: '/resources/brands/asus.png',
        link: '/product/search?brand=asus'
      },{
        logo: '/resources/brands/hp.png',
        link: '/product/search?brand=hp'
      },{
        logo: '/resources/brands/evga.png',
        link: '/product/search?brand=evga',
      },{
        logo: '/resources/brands/gigabyte.jpg',
        link: '/product/search?brand=gigabyte'
      },{
        logo: '/resources/brands/logitech.png',
        link: '/product/search?brand=logitech'
      },{
        logo: '/resources/brands/dell.png',
        link: '/product/search?brand=dell'
      },{
        logo: '/resources/brands/lg.png',
        link: '/product/search?brand=lg'
      },{
        logo: '/resources/brands/samsung.jpg',
        link: '/product/search?brand=samsung',
      },{
        logo: '/resources/brands/philips.png',
        link: '/product/search?brand=philips'
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
