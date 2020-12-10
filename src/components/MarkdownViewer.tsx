import { defineComponent } from 'vue'

import 'prismjs/themes/prism-okaidia.css'

export default defineComponent({
    name: 'MarkdownPreview',
    props: {
        html: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        return () => {
            return <div v-html={props.html} class="markdown"></div>
        }
    },
})
