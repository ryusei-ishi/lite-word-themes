import { registerBlockType } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';

registerBlockType('wdl/shin-gas-station-01-contact', {
    title: 'お問合わせフォーム shin shop pattern 01',
    icon: 'email',
    category: 'liteword-buttons',
    attributes: {
        formId: {
            type: 'number',
            default: 1,
        },
    },
    edit: ({ attributes, setAttributes }) => {
        const { formId } = attributes;

        return (
            <div className="lw_mail_form_block">
                <p>※お問合わせフォームパターンを選択してください。</p>
                <SelectControl
                    value={formId}
                    options={[...Array(40)].map((_, i) => ({
                        label: `LiteWord専用 お問合わせフォームパターン ${i + 1}`,
                        value: i + 1,
                    }))}
                    onChange={(value) => setAttributes({ formId: parseInt(value, 10) })}
                />
            </div>
        );
    },
    save: ({ attributes }) => {
        return <div className="shin-gas-station-01-contact">{`[lw_mail_form_select id='${attributes.formId}']`}</div>;
    }
});
