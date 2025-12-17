import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';
import metadata from './block.json';

registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const { formId } = attributes;

        const blockProps = useBlockProps({
            className: 'lw_mail_form_block'
        });

        return (
            <div {...blockProps}>
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
        const blockProps = useBlockProps.save({
            className: 'shin-gas-station-01-contact'
        });
        return <div {...blockProps}>{`[lw_mail_form_select id='${attributes.formId}']`}</div>;
    }
});
