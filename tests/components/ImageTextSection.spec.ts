import { afterEach, describe, expect, test } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { ComponentPublicInstance, nextTick } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ImageContent from '../../src/components/ImageTextSection.vue';

interface ImageContentProps {
  image: string;
  title: string;
  description: string;
}
type ImageContentComponent = ComponentPublicInstance<ImageContentProps>

const vuetify = createVuetify({ components, directives });

describe('ImageContent.vue', () => {
  let wrapper: VueWrapper<ImageContentComponent>;

  const defaultProps = {
    image: '/img/demo.jpg',
    title: 'Test title',
    description: 'Test description',
  }

  const mountImageContent = (props = {}) => {
    return mount(ImageContent, {
      global: {
        plugins: [vuetify],
      },
      props: { ...defaultProps, ...props },
    })
  }

  afterEach(() => {
    if (wrapper) wrapper.unmount()
  })

  test('should mount the component', () => {
    wrapper = mountImageContent();
    expect(wrapper.exists()).toBe(true);
  })

  test('renders title and description', async () => {
    wrapper = mountImageContent();
    await nextTick();

    expect(wrapper.get('h3').text()).toBe(defaultProps.title);
    expect(wrapper.get('p').text()).toBe(defaultProps.description);
  });

  test('passes image props to VImg and underlying <img>', async () => {
    wrapper = mountImageContent();
    await nextTick();

    const vImg = wrapper.findComponent({ name: 'VImg' });
    expect(vImg.exists()).toBe(true);

    // Vuetify component props
    expect(vImg.props('src')).toBe(defaultProps.image);
    expect(vImg.props('alt')).toBe('Real-time estimation');
    expect(vImg.props('cover')).toBe(true);
    expect(vImg.props('height')).toBe('320');

    // DOM inside VImg
    const imgEl = vImg.find('img');
    expect(imgEl.exists()).toBe(true);
    expect(imgEl.attributes('src')).toBe(defaultProps.image);
    expect(imgEl.attributes('alt')).toBe('Real-time estimation');
  });

})
