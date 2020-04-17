/**
 * External dependencies
 */
import React from 'react';
import { View, TouchableWithoutFeedback, I18nManager } from 'react-native';

/**
 * WordPress dependencies
 */
import { ToolbarButton, Toolbar } from '@wordpress/components';
import { Breadcrumb } from '@wordpress/block-editor';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import styles from './styles.scss';
import NavigateUpSVG from './nav-up-icon';

const FloatingToolbar = ( {
	clientId,
	parentId,
	showFloatingToolbar,
	onNavigateUp,
} ) =>
	showFloatingToolbar && (
		<TouchableWithoutFeedback accessible={ false }>
			<View style={ styles.floatingToolbar }>
				{ !! parentId && (
					<Toolbar passedStyle={ styles.toolbar }>
						<ToolbarButton
							title={ __( 'Navigate Up' ) }
							onClick={ () => onNavigateUp( parentId ) }
							icon={
								<NavigateUpSVG isRTL={ I18nManager.isRTL } />
							}
						/>
						<View style={ styles.pipe } />
					</Toolbar>
				) }
				<Breadcrumb clientId={ clientId } />
			</View>
		</TouchableWithoutFeedback>
	);

export default compose( [
	withSelect( ( select ) => {
		const {
			getSelectedBlockClientId,
			getBlockHierarchyRootClientId,
			getBlockRootClientId,
			getBlockCount,
		} = select( 'core/block-editor' );

		const clientId = getSelectedBlockClientId();

		const isSelected = !! clientId;
		const rootBlockId = getBlockHierarchyRootClientId( clientId );
		const parentId = getBlockRootClientId( clientId );
		const hasRootInnerBlocks = !! getBlockCount( rootBlockId );

		const showFloatingToolbar = isSelected && hasRootInnerBlocks;

		return {
			clientId,
			showFloatingToolbar,
			parentId,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { selectBlock } = dispatch( 'core/block-editor' );

		return {
			onNavigateUp( clientId, initialPosition ) {
				selectBlock( clientId, initialPosition );
			},
		};
	} ),
] )( FloatingToolbar );
