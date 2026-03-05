/** Cloudflare Workers AI models used by this project */

export const llama31 = {
	id: '@cf/meta/llama-3.1-8b-instruct',
	description: 'Meta Llama 3.1 8B Instruct - used for the Socratic neuroscience tutor (/ask)',
} as const;

export const resnet50 = {
	id: '@cf/microsoft/resnet-50',
	description: 'ResNet-50 image classifier - used to demonstrate the ventral visual stream analogy (/vision)',
} as const;
