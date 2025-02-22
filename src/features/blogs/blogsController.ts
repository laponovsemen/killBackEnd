import { Request, Response } from "express";
import { APIErrorResult } from "../../output-errors-type";
import { ParamType } from ".";
import {
  BlogInputModel,
  BlogViewModel,
  BlogPostInputModel,
  PostViewModel,
} from "../../models";
import { blogsService } from "../../services";
import { blogsQueryRepository } from "../../query_repositories";
import { queryFilter } from "../../utils/queryFilter";
import { mapBlogDBToView, mapPostsToView } from "../../utils/mapDBToView";

export const blogsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const blogs = await blogsQueryRepository.getAllBlogs(
        queryFilter(req.query)
      );

      if (!blogs) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(blogs);
    } catch (error) {
      console.error("Error in fetching all blogs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const foundBlog = await blogsQueryRepository.getByIdBlog(req.params.id);

      if (!foundBlog) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(foundBlog);
    } catch (error) {
      console.error("Error in fetching blog by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteById: async (req: Request, res: Response<void | APIErrorResult>) => {
    try {
      const blogToRemove = await blogsService.removeBlog(req.params.id);

      if (!blogToRemove) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in fetching delete blog by ID:", error);
      res.status(500);
    }
  },

  create: async (
    req: Request<{}, {}, BlogInputModel>,
    res: Response<BlogViewModel | APIErrorResult>
  ) => {
    try {
      const newBlog = await blogsService.createBlog(req.body);

      if (!newBlog) {
        res.sendStatus(404);
        return;
      }

      res.status(201).json(mapBlogDBToView(newBlog));
    } catch (error) {
      console.error("Error in fetching create blog:", error);
      res.status(500);
    }
  },

  update: async (
    req: Request<ParamType, {}, BlogInputModel>,
    res: Response<BlogViewModel | APIErrorResult>
  ) => {
    try {
      const blogToUpdate = await blogsService.updateBlog(
        req.body,
        req.params.id
      );

      if (!blogToUpdate) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error in fetching update blog by ID:", error);
      res.status(500);
    }
  },

  getBlogPosts: async (req: Request, res: Response) => {
    try {
      const foundBlogPosts = await blogsQueryRepository.getPostsOfBlog(
        req.params.blogId,
        queryFilter(req.query)
      );

      if (foundBlogPosts.items.length === 0 || !foundBlogPosts) {
        res.sendStatus(404);
        return;
      }

      res.status(200).json(foundBlogPosts);
    } catch (error) {
      console.error("Error in fetching posts of specific blog ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createBlogPost: async (
    req: Request<{ blogId: string }, {}, BlogPostInputModel>,
    res: Response<PostViewModel | APIErrorResult>
  ) => {
    try {
      const newPost = await blogsService.createPost(
        req.params.blogId,
        req.body
      );
      if (!newPost) {
        res.sendStatus(404);
        return;
      }
      res.status(201).json(mapPostsToView(newPost));
    } catch (error) {
      console.error("Error in fetching create post:", error);
      res.status(500);
    }
  },
};
