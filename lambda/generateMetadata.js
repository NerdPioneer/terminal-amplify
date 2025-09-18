const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/**
 * AWS Lambda function to generate metadata.json from Markdown logs in S3
 * Scans the logs bucket for .md files and creates a structured metadata file
 */
exports.handler = async (event) => {
    console.log('Starting metadata generation...');
    
    try {
        const bucketName = process.env.LOGS_BUCKET_NAME;
        const metadataKey = 'metadata/metadata.json';
        
        if (!bucketName) {
            throw new Error('LOGS_BUCKET_NAME environment variable not set');
        }
        
        // List all objects in the logs/ prefix
        const listParams = {
            Bucket: bucketName,
            Prefix: 'logs/'
        };
        
        const listResult = await s3.listObjectsV2(listParams).promise();
        
        // Filter for .md files and extract metadata
        const markdownFiles = listResult.Contents
            .filter(obj => obj.Key.endsWith('.md'))
            .map(obj => {
                const fileName = obj.Key.split('/').pop();
                const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
                
                return {
                    key: obj.Key,
                    fileName: fileName,
                    lastModified: obj.LastModified,
                    size: obj.Size,
                    date: dateMatch ? dateMatch[1] : null,
                    title: fileName.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
                };
            })
            .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        // Create metadata structure
        const metadata = {
            generatedAt: new Date().toISOString(),
            totalLogs: markdownFiles.length,
            logs: markdownFiles.map(file => ({
                fileName: file.fileName,
                title: file.title,
                date: file.date,
                lastModified: file.lastModified,
                size: file.size,
                s3Key: file.key
            }))
        };
        
        // Upload metadata to S3
        const uploadParams = {
            Bucket: bucketName,
            Key: metadataKey,
            Body: JSON.stringify(metadata, null, 2),
            ContentType: 'application/json',
            CacheControl: 'max-age=300' // 5 minutes cache
        };
        
        await s3.upload(uploadParams).promise();
        
        console.log(`Metadata generated successfully: ${metadata.totalLogs} logs processed`);
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Metadata generated successfully',
                totalLogs: metadata.totalLogs,
                metadataKey: metadataKey
            })
        };
        
    } catch (error) {
        console.error('Error generating metadata:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to generate metadata',
                message: error.message
            })
        };
    }
};
